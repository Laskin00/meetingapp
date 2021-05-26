package com.al.meetingapp.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.al.meetingapp.entities.Meeting;

@Repository
@Transactional
public interface MeetingRepository extends JpaRepository<Meeting, String> {

	@Query("SELECT m FROM Meeting m WHERE m.id = ?1")
	Meeting findByUuid(String uuid);
	
	@Query("SELECT m.inviteToken FROM Meeting m WHERE m.id = ?1")
	String getInviteTokenOfMeeting(String uuid);
	
	@Query("SELECT m FROM Meeting m WHERE m.inviteToken = ?1")
	Meeting findByInviteToken(String inviteToken);

	@Transactional
	@Modifying
	@Query("DELETE FROM Meeting m WHERE m.id = ?1")
	void deleteByUuid(String uuid);


}
