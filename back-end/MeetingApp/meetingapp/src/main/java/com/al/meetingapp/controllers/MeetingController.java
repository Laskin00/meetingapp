package com.al.meetingapp.controllers;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

import com.al.meetingapp.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.*;

import com.al.meetingapp.entities.Meeting;
import com.al.meetingapp.entities.MeetingUserConnection;
import com.al.meetingapp.entities.User;
import com.al.meetingapp.entities.Comment;
import com.al.meetingapp.helpers.HelperService;
import com.al.meetingapp.repositories.MeetingRepository;
import com.al.meetingapp.repositories.MeetingUserConnectionRepository;
import com.al.meetingapp.repositories.UserRepository;

@RestController
@CrossOrigin(origins = "localhost:3000")
@RequestMapping("/meeting")
public class MeetingController {
	@Autowired
	private MeetingRepository meetingRepository;
	
	@Autowired
	private MeetingUserConnectionRepository meetingUserConnectionRepository;
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CommentRepository commentRepository;

	@GetMapping("/{uuid}")
	private Meeting getMeetingByUuid(@PathVariable String uuid) {
		return meetingRepository.findByUuid(uuid);
	}
	
	@PostMapping("/create")
	private String createMeetingAndReturnItsUuid(@RequestBody String meetingAndSessionToken) {
		String sessionToken = HelperService.valueOfARepresentingKeyInJsonString("sessionToken",meetingAndSessionToken);
		String description = HelperService.valueOfARepresentingKeyInJsonString("description", meetingAndSessionToken);
		String location = HelperService.valueOfARepresentingKeyInJsonString("location", meetingAndSessionToken);
		String dateString = HelperService.valueOfARepresentingKeyInJsonString("date", meetingAndSessionToken);
		String timeString =  HelperService.valueOfARepresentingKeyInJsonString("time", meetingAndSessionToken);
		User user = userRepository.findBySessionToken(sessionToken);
		if (user == null){
			return HelperService.toJson("error", "Invalid session token");
		}
		Meeting meeting = new Meeting();
		meeting.setDescription(description);
		meeting.setLocation(location);
		System.out.println(timeString);
		if(dateString != null){
			meeting.setDate(Date.valueOf(dateString));
		}
		if(timeString != null){
			meeting.setTime(Time.valueOf(timeString));
		}
		meetingRepository.save(meeting);
		try {
			joinMeeting(user, meeting, true);
			return HelperService.toJson("meetingUuid", meeting.getId());
		}catch(DataIntegrityViolationException e){
			return HelperService.toJson("error",e.getMessage());
		}
	}

	@GetMapping("/owner/{uuid}")
	private User getOwner(@PathVariable String uuid){
		Meeting meeting = meetingRepository.findByUuid(uuid);
		return meetingUserConnectionRepository.getMeetingOwner(meeting);
	}
	@DeleteMapping("/delete/{uuid}/{sessionToken}")
	private String deleteMeeting(@PathVariable String uuid, @PathVariable String sessionToken){
		User user = userRepository.findBySessionToken(sessionToken);
		Meeting meeting = meetingRepository.findByUuid(uuid);
		if(user == null) {
			return HelperService.toJson("error","Invalid sessionToken.");
		}else if(meeting == null){
			return HelperService.toJson("error","Invalid meeting uuid.");
		}
		MeetingUserConnection muc = meetingUserConnectionRepository.getMeetingUserConnectionByMeetingAndUser(meeting,user);
		if(!muc.isOwner() && !user.getIsAdmin()){
			return HelperService.toJson("error","You are not owner of the meeting.");
		}
		meetingUserConnectionRepository.deleteMeetingUserConnectionByMeeting(meeting);
		meetingRepository.deleteByUuid(meeting.getId());
		return HelperService.toJson("message", "Meeting deleted successfully.");
	}

	@PostMapping("/join/{inviteToken}")
	private String joinByInviteToken(@PathVariable String inviteToken, @RequestBody String sessionToken) {
		User invited = UserController.getUserBySessionTokenInJson(userRepository,sessionToken);
		if(invited == null){
			return HelperService.toJson("error","Invalid sessionToken");
		}
		Meeting invitedTo = meetingRepository.findByInviteToken(inviteToken);
		if(invitedTo == null){
			return HelperService.toJson("error","Invalid inviteToken");
		}
		try {
			joinMeeting(invited, invitedTo, false);
			return HelperService.toJson("message", "You have joined the meeting successfully");
		}catch(DataIntegrityViolationException e){
			return HelperService.toJson("error", e.getMessage());
		}
	}
	@PostMapping("/comment/{uuid}")
	private String commentOnMeeting(@PathVariable String uuid, @RequestBody String contentAndSessionToken){
		String sessionToken = HelperService.valueOfARepresentingKeyInJsonString("sessionToken",contentAndSessionToken);
		String content = HelperService.valueOfARepresentingKeyInJsonString("content",contentAndSessionToken);

		User user = userRepository.findBySessionToken(sessionToken);
		if(user == null){
			return HelperService.toJson("error","Invalid sessionToken");
		}

		Meeting meeting = meetingRepository.findByUuid(uuid);
		if(meeting == null){
			return HelperService.toJson("error","Invalid meeting uuid");
		}
		System.out.println(content);
		Comment comment = new Comment(user,meeting,content);
		commentRepository.save(comment);

		return HelperService.toJson("message","Commented successfully");
	}
	@GetMapping("/comments/{uuid}")
	private List<Comment> getMeetingComments(@PathVariable String uuid) {
		Meeting m = meetingRepository.findByUuid(uuid);
		if(m == null){
			HelperService.toJson("error","Invalid meeting uuid.");
		}
		return commentRepository.findByMeeting(m);
	}

	@PostMapping("/leave/{uuid}")
	private String leaveByUuid(@PathVariable String uuid, @RequestBody String sessionToken){
		User leaver = UserController.getUserBySessionTokenInJson(userRepository,sessionToken);
		if(leaver == null){
			return HelperService.toJson("error","Invalid sessionToken");
		}
		Meeting toLeave = meetingRepository.findByUuid(uuid);
		if(toLeave == null){
			return HelperService.toJson("error","Invalid inviteToken");
		}
		MeetingUserConnection muc = meetingUserConnectionRepository.getMeetingUserConnectionByMeetingAndUser(toLeave,leaver);
		if(muc == null){
			return HelperService.toJson("message","You've already left the meeting or it has been deleted.");
		}
		if(muc.isOwner()){
			return HelperService.toJson("message","You must delete the meeting instead.");
		}else{
			meetingUserConnectionRepository.deleteMeetingUserConnectionByMeetingAndUser(toLeave,leaver);
			return HelperService.toJson("message","You have left the meeting successfully.");
		}
	}
	
	@GetMapping("/{uuid}/inviteToken")
	private String getInviteToken(@PathVariable String uuid) {
		return HelperService.toJson("inviteToken",meetingRepository.getInviteTokenOfMeeting(uuid));
	}
	
	@GetMapping("/{uuid}/users")
	private List<User> getAttenders(@PathVariable String uuid) {
		Meeting meeting = meetingRepository.findByUuid(uuid);
		return meetingUserConnectionRepository.getUsersOfMeeting(meeting);
	}
	
	private void joinMeeting(User invited, Meeting invitedTo, boolean isOwner) throws DataIntegrityViolationException {
		meetingUserConnectionRepository.save(new MeetingUserConnection(invitedTo,invited,isOwner));

	}
	

}
