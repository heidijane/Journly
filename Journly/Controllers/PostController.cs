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
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly PostRepository _postRepository;
        private readonly UserRepository _userRepository;
        public PostController(ApplicationDbContext context, IConfiguration configuration)
        {
            _postRepository = new PostRepository(context, configuration);
            _userRepository = new UserRepository(context, configuration);
        }

        [Authorize]
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

        [Authorize]
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

        private User GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userRepository.GetByFirebaseUserId(firebaseUserId);
        }

    }
}
