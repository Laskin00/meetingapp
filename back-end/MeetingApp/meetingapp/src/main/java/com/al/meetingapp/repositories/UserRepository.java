package com.al.meetingapp.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.al.meetingapp.entities.User;
//TODO add possible queries for password changes
@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, String> {
	
	@Query("SELECT u FROM User u WHERE u.lastName = ?1")
	List<User> findByLastName(String lastName);
	
	@Query("SELECT u FROM User u WHERE u.id = ?1")
	User findByUuid(String uuid);
	
	@Query("SELECT u FROM User u WHERE u.firstName = ?1")
	List<User> findByFirstName(String firstName);
	
	@Query("SELECT u FROM User u WHERE u.email = ?1")
	User findByEmail(String email);

	@Query("SELECT u FROM User u WHERE u.sessionToken = ?1")
	User findBySessionToken(String sessionToken);
}
