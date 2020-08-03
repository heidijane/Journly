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

        //returns a list of moods
        //if criterion is left blank it will return all moods
        //otherwise it will return moods that have a name containing the search criterion
        [Authorize]
        [HttpGet]
        public IActionResult GetMoods(string criterion = "")
        {
            List<MoodType> moods = _moodRepository.GetMoods(criterion);
            return Ok(moods);
        }

        ////returns a list of mood types that have recently been used
        [HttpGet("wall")]
        public IActionResult MoodWall(int limit = 50)
        {
            return Ok(_moodRepository.MoodWall(limit));
        }

    }
}
