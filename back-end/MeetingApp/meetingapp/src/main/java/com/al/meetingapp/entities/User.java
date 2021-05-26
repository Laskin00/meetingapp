package com.al.meetingapp.entities;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;


@Entity
@Table(name="users")
public class User {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "user_uuid", unique = true)
	private String id;
	
	@NotNull
	@Column(name = "first_name")
	private String firstName;
	
	@NotNull
	@Column(name = "last_name")
	private String lastName;

	@Column(name = "session_token")
	private String sessionToken;

	@Column(unique = true)
    @NotNull
	@Email
	private String email;
	
	@NotNull
	@Column(name = "pwd")
	private String password;

	@NotNull
	@Column(name = "is_admin")
	private Boolean isAdmin;
	
	@OneToMany(mappedBy="user",fetch = FetchType.LAZY)
	@JsonIgnore
	private List<MeetingUserConnection> meetingConnections;

	public User() {}
	
	
	public User(String firstName, String lastName, String email, String password) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
	}
	
	

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getSessionToken() {
		return sessionToken;
	}
	public void setSessionToken(String sessionToken) {
		this.sessionToken = sessionToken;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setIsAdmin(Boolean isAdmin) {this.isAdmin = isAdmin;}

	public Boolean getIsAdmin() {return isAdmin;}
	
	public List<MeetingUserConnection> getMeetingConnections(){
		return meetingConnections;
	}

	public String getId() {
		return id;
	}

	public void setUuid(String uuid){
		this.id = uuid;
	}

	
}