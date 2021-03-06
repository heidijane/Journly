﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Journly.Data;
using Journly.Models;
using Journly.Repositories;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using Journly.Services;
using Ganss.XSS;

namespace Journly.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly PostRepository _postRepository;
        private readonly UserRepository _userRepository;

        private readonly FlaggedWordService _flaggedWordService;

        public PostController(ApplicationDbContext context, IConfiguration configuration)
        {
            _postRepository = new PostRepository(context, configuration);
            _userRepository = new UserRepository(context, configuration);

            _flaggedWordService = new FlaggedWordService(context);
        }

        //gets post by ID
        //works for both clients and therapists
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var post = _postRepository.GetById(id);
            if (post == null)
            {
                return NotFound();
            }
            //check to make sure that the user is authorized to see the post
            User currentUser = GetCurrentUserProfile();
            if (currentUser.Id != post.UserId)
            {
                return Unauthorized();
            }

            //or make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(post.UserId, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }

            return Ok(post);
        }

        //gets current user's posts
        //only works for clients
        [HttpGet("current")]
        public IActionResult GetCurrentUserPosts(int limit, int start)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            List <Post> posts = _postRepository.GetPostsByUserId(currentUser.Id, limit, start, false);
            return Ok(posts);
        }

        //gets current user's post by date
        //only works for clients
        [HttpGet("current/{date}")]
        public IActionResult GetCurrentUserEntriesByDate(DateTime date)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }

            List<Post> posts = _postRepository.GetPostsByUserIdAndDate(currentUser.Id, date, false);
            return Ok(posts);
        }

        //gets posts for a specific user by date
        //only works for therapists
        [HttpGet("user/{id}")]
        public IActionResult GetUserEntriesByDate(int id, DateTime date)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            //or make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(id, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }
            List<Post> posts = _postRepository.GetPostsByUserIdAndDate(id, date);
            return Ok(posts);
        }

        //gets the most recent post for a specific user
        //works for therapists and clients
        [HttpGet("latest/{id}")]
        public IActionResult GetMostRecentPostByUserId(int id)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            //make sure this post belongs to current user
            if (currentUser.UserTypeId == 0 && currentUser.Id != id)
            {
                return Unauthorized();
            }
            //or make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(id, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }

            Post post = _postRepository.MostRecentPost(id);
            if (post == null)
            {
                return NoContent();
            }
            return Ok(post);
        }

        //gets the number of unread posts for a therapist
        [HttpGet("unreadcount")]
        public IActionResult GetUnreadCount()
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            int count = _postRepository.CountUnreadByTherapist(currentUser.Id);
            return Ok(count);
        }

        //gets the number of unread posts by a specific user for a therapist
        [HttpGet("unreadcount/{id}")]
        public IActionResult GetUnreadCountByUser(int id)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            //make sure this post belongs to current user
            if (currentUser.UserTypeId == 0 && currentUser.Id != id)
            {
                return Unauthorized();
            }
            //or make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(id, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }
            int count = _postRepository.CountUnreadByUser(id);
            return Ok(count);
        }

        //gets unread posts for a therapist
        [HttpGet("unread")]
        public IActionResult GetUnread(int limit, int start)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            var result = _postRepository.UnreadPostsByTherapist(currentUser.Id, limit, start);
            return Ok(result);
        }

        //get unread posts by a specific user for a therapist
        [HttpGet("unread/{id}")]
        public IActionResult GetUnreadByUser(int id, int limit, int start)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            //make sure this post belongs to current user
            if (currentUser.UserTypeId == 0 && currentUser.Id != id)
            {
                return Unauthorized();
            }
            //or make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(id, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }
            var result = _postRepository.UnreadPostsByUser(id, limit, start);
            return Ok(result);
        }

        //get posts matching certain search criteria
        //can be used by therapists and clients
        [HttpGet("search")]
        public IActionResult Search(int? clientId = null, bool? viewed = null, bool? flagged = null, bool orderDesc = true, int limit = 0, int start = 0, bool deleted = true)
        {
            //get the current user info
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }

            int? therapistId = null;
            if (currentUser.UserTypeId == 1)
            {
                therapistId = currentUser.Id;
            }

            //make sure that either the therapistId or the clientId is filled out
            if (therapistId == null && clientId == null)
            {
                return NotFound();
            }

            //make sure user has permissions to see this client's posts
            if (currentUser.UserTypeId == 1 && clientId != null)
            {
                bool isTherapist = _userRepository.IsTherapistForUser(clientId.GetValueOrDefault(), currentUser.Id);
                if (currentUser.UserTypeId == 1 && !isTherapist)
                {
                    return Unauthorized();
                }
            }
            else if (clientId != null)
            {
                //make sure that client can only view their own posts!
                if (currentUser.Id != clientId)
                {
                    return Unauthorized();
                }
            }

            List<Post> posts = _postRepository.Search(therapistId, clientId, viewed, flagged, orderDesc, limit, start, deleted);
            return Ok(posts);
        }

        //add a new post to the db and checks for flagged words
        [HttpPost]
        public IActionResult Post(Post post)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            post.UserId = currentUser.Id;
            post.CreateDate = DateTime.Now;

            //sanitize the html
            var sanitizer = new HtmlSanitizer();
            post.Content = sanitizer.Sanitize(post.Content);

            //check for flagged words
            if (_flaggedWordService.HasFlaggedWord(post.Content))
            {
                post.Flagged = true;
            }

            _postRepository.Add(post);
            return CreatedAtAction(nameof(Get), new { id = post.Id }, post);
        }

        //edits a post in the db and checks for flagged words
        [HttpPut]
        public IActionResult Edit(Post newPost)
        {
            Post post = _postRepository.GetById(newPost.Id);
            if (post == null)
            {
                return NotFound();
            }
            //check to make sure that the user is authorized to edit the post
            User currentUser = GetCurrentUserProfile();
            if (currentUser.Id != post.UserId)
            {
                return Unauthorized();
            }
            //update the post object to deleted status

            //sanitize the html
            var sanitizer = new HtmlSanitizer();
            post.Content = sanitizer.Sanitize(newPost.Content);

            post.MoodId = newPost.MoodId;
            post.EditTime = DateTime.Now;

            //check for flagged words
            if (_flaggedWordService.HasFlaggedWord(post.Content))
            {
                post.Flagged = true;
            }

            _postRepository.Update(post);
            return CreatedAtAction(nameof(Get), new { id = post.Id }, post);
        }

        //marks a post as read by a therapist and updates the comment if provided in the newPost object
        [HttpPut("comment")]
        public IActionResult TherapistUpdate(Post newPost)
        {
            Post post = _postRepository.GetById(newPost.Id);
            if (post == null)
            {
                return NotFound();
            }

            User currentUser = GetCurrentUserProfile();
            //make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(post.UserId, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }

            //update the post object's view time and comment

            post.ViewTime = DateTime.Now;
            post.TherapistId = currentUser.Id;

            //sanitize the html
            var sanitizer = new HtmlSanitizer();
            post.Comment = sanitizer.Sanitize(newPost.Comment);

            _postRepository.Update(post);
            return CreatedAtAction(nameof(Get), new { id = post.Id }, post);
        }

        //marks all posts by a specific user on a specific date for a therapist
        [HttpPut("markallread")]
        public IActionResult MarkAllRead(int id, DateTime date)
        {
            User currentUser = GetCurrentUserProfile();
            //make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(id, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }

            List<Post> posts = _postRepository.GetPostsByUserIdAndDate(id, date);

            //filter out posts that have already been viewed
            List<Post> unreadPosts = posts.Where(p => p.ViewTime == null).ToList();

            foreach (Post post in unreadPosts)
            {
                //update the post object's view time and comment
                post.ViewTime = DateTime.Now;
                post.TherapistId = currentUser.Id;
                _postRepository.Update(post);
            }
            
            return Ok();
        }

        //toggles a post's flagged status
        //only for therapists
        [HttpPut("flag/{id}")]
        public IActionResult FlagUpdate(int id)
        {
            Post post = _postRepository.GetById(id);
            if (post == null)
            {
                return NotFound();
            }

            User currentUser = GetCurrentUserProfile();
            //make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(post.UserId, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }

            //switch post's flag status
            if (post.Flagged == true)
            {
                post.Flagged = false;
            } else
            {
                post.Flagged = true;
            }

            _postRepository.Update(post);
            return CreatedAtAction(nameof(Get), new { id = post.Id }, post);
        }

        //soft-deletes a post
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Post post = _postRepository.GetById(id);
            if (post == null)
            {
                return NotFound();
            }
            //check to make sure that the user is authorized to delete the post
            User currentUser = GetCurrentUserProfile();
            if (currentUser.Id != post.UserId)
            {
                return Unauthorized();
            }
            //update the post object to deleted status
            post.Deleted = true;
            _postRepository.Update(post);
            return NoContent();
        }

        private User GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userRepository.GetByFirebaseUserId(firebaseUserId);
        }

    }
}
