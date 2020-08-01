using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Journly.Data;
using Journly.Models;
using Journly.Repositories;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;
using System.Collections.Generic;

namespace Journly.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly PostRepository _postRepository;
        private readonly UserRepository _userRepository;
        private readonly FlaggedWordRepository _flaggedWordRepository;
        public PostController(ApplicationDbContext context, IConfiguration configuration)
        {
            _postRepository = new PostRepository(context, configuration);
            _userRepository = new UserRepository(context, configuration);
            _flaggedWordRepository = new FlaggedWordRepository(context);
        }

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
            return Ok(post);
        }

        [HttpGet("current")]
        public IActionResult GetCurrentUserPosts(int limit, int start)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            List <Post> posts = _postRepository.GetPostsByUserId(currentUser.Id, limit, start);
            return Ok(posts);
        }

        [HttpGet("current/{date}")]
        public IActionResult GetCurrentUserEntriesByDate(DateTime date)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            List<Post> posts = _postRepository.GetPostsByUserIdAndDate(currentUser.Id, date);
            return Ok(posts);
        }

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
            return Ok(post);
        }

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

            //check for flagged words
            if (_flaggedWordRepository.HasFlaggedWord(post.Content))
            {
                post.Flagged = true;
            }

            _postRepository.Add(post);
            return CreatedAtAction(nameof(Get), new { id = post.Id }, post);
        }

        [HttpPut]
        public IActionResult Edit(Post newPost)
        {
            Post post = _postRepository.GetById(newPost.Id);
            if (post == null)
            {
                return NotFound();
            }
            //check to make sure that the user is autorized to edit the post
            User currentUser = GetCurrentUserProfile();
            if (currentUser.Id != post.UserId)
            {
                return Unauthorized();
            }
            //update the post object to deleted status

            post.ViewTime = DateTime.Now;
            post.Content = newPost.Content;
            post.MoodId = newPost.MoodId;

            //check for flagged words
            if (_flaggedWordRepository.HasFlaggedWord(post.Content))
            {
                post.Flagged = true;
            }

            _postRepository.Update(post);
            return CreatedAtAction(nameof(Get), new { id = post.Id }, post);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Post post = _postRepository.GetById(id);
            if (post == null)
            {
                return NotFound();
            }
            //check to make sure that the user is autorized to delete the post
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

        [HttpGet("search")]
        public IActionResult Search(int? clientId = null, bool? viewed = null, bool? flagged = null, bool orderDesc = true)
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
            } else if (clientId != null)
            {
                //make sure that client can only view their own posts!
                if (currentUser.Id != clientId)
                {
                    return Unauthorized();
                }
            }

            List<Post> posts = _postRepository.Search(therapistId, clientId, viewed, flagged, orderDesc);
            return Ok(posts);
        }

        private User GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userRepository.GetByFirebaseUserId(firebaseUserId);
        }

    }
}
