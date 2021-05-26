package com.al.meetingapp.repositories;

import com.al.meetingapp.entities.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import com.al.meetingapp.entities.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    @Query("SELECT c FROM Comment c WHERE c.meeting = ?1")
    List<Comment> findByMeeting(Meeting meeting);


}
