using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Journly.Data;
using Journly.Models;
using Microsoft.AspNetCore.JsonPatch.Internal;
using System;
using Microsoft.EntityFrameworkCore.Internal;

namespace Journly.Repositories
{
    public class MoodRepository
    {
        private readonly ApplicationDbContext _context;

        public MoodRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //returns a list of moods
        //if criterion is left blank it will return all moods
        //otherwise it will return moods that have a name containing the search criterion
        public List<MoodType> GetMoods(string criterion)
        {
            var query = _context.MoodType.OrderBy(mt => mt.Id);

            return criterion != ""
                ? query.Where(mt => mt.Name.Contains(criterion)).ToList()
                : query.ToList();
        }

        //returns a list of mood types that have recently been used
        public List<MoodType> MoodWall(int limit = 50)
        {
            return _context.Post
                    .OrderByDescending(p => p.CreateDate)
                    .Where(p => p.Deleted == false)
                    .Select(p => p.Mood)
                    .Take(limit)                    
                    .ToList();
        }
    }
}