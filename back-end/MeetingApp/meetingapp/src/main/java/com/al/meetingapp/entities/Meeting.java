package com.al.meetingapp.entities;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Column;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import com.al.meetingapp.helpers.HelperService;

@Entity
@Table(name = "meetings")
public class Meeting {

	@Id
	@GeneratedValue(generator="system-uuid")
	@GenericGenerator(name="system-uuid",strategy = "uuid")
	@Column(name = "meeting_uuid")
	private String id;
	@Column(name = "meeting_date")
	private Date date;
	@Column(name = "meeting_time")
	private Time time;
	@Column(name = "meeting_location")
	private String location;
	private String description;
	@Column(name = "invite_token")
	private String inviteToken = HelperService.generateNewToken();
	
	@OneToMany(mappedBy="meeting",fetch = FetchType.LAZY)
	@JsonIgnore
	private List<MeetingUserConnection> users;

	@OneToMany(mappedBy="meeting",fetch = FetchType.LAZY)
	private List<Comment> comments;
	
	public Meeting() {
		
	}
	
	public Meeting(Date date, Time time, String description) {
		this.date = date;
		this.time = time;
		this.description = description;
	}
	
	public Meeting(Date date, String description) {
		this.date = date;
		this.description = description;
	}
	


	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Time getTime() {
		return time;
	}

	public void setTime(Time time) {
		this.time = time;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}


	public String getInviteToken() {
		return inviteToken;
	}

	public String getId() {
		return id;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
	
	public List<MeetingUserConnection> getUsers(){
		return users;
	}
	public List<Comment> getComments(){return comments;}
	
}
