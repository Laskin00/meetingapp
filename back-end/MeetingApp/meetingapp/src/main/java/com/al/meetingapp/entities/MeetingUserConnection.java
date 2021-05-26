package com.al.meetingapp.entities;

import javax.persistence.*;

@Entity
@Table(name = "meetinguserconnections")
public class MeetingUserConnection {
	
	@Id 
	@GeneratedValue
	@Column(unique = true)
	private long id;
	
	private boolean isOwner;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_uuid")
	private User user;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "meeting_uuid")
	private Meeting meeting;
	
	public MeetingUserConnection() {

	}
	
	public MeetingUserConnection(Meeting meeting, User user, boolean isOwner) {
		this.user = user;
		this.meeting = meeting;
		this.isOwner = isOwner;
	}
	public boolean isOwner() {
		return isOwner;
	}

	public void setOwner(boolean isOwner) {
		this.isOwner = isOwner;
	}

	public long getId() {
		return id;
	}

}
