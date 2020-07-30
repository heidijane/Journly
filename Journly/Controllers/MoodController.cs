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
    public class MoodController : ControllerBase
    {
        private readonly MoodRepository _moodRepository;
        private readonly UserRepository _userRepository;
        public MoodController(ApplicationDbContext context, IConfiguration configuration)
        {
            _moodRepository = new MoodRepository(context);
            _userRepository = new UserRepository(context, configuration);
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetCurrentUserPosts(string criterion = "")
        {
            List<MoodType> moods = _moodRepository.GetMoods(criterion);
            return Ok(moods);
        }

    }
}
