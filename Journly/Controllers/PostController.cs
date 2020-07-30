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

        [HttpGet]
        public IActionResult Get(int id)
        {
            var post = _postRepository.GetById(id);
            if (post == null)
            {
                return NotFound();
            }
            //check to make sure that the user is autorized to see the post
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

        private User GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userRepository.GetByFirebaseUserId(firebaseUserId);
        }

    }
}
