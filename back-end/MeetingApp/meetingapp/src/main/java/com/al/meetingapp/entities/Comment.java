package com.al.meetingapp.entities;

import javax.persistence.*;

@Entity
@Table(name = "meetingcomments")
public class Comment {
    @Id
    @GeneratedValue
    @Column(unique = true,name = "comment_id")
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_uuid")
    public User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "meeting_uuid")
    private Meeting meeting;

    @Column(name="comment_content")
    public String content;

    public Comment(){}

    public Comment(User user, Meeting meeting, String content){
        this.user = user;
        this.meeting = meeting;
        this.content = content;
    }
}
