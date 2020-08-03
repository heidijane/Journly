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

        public List<MoodType> GetMoods(string criterion)
        {
            var query = _context.MoodType.OrderBy(mt => mt.Id);

            return criterion != ""
                ? query.Where(mt => mt.Name.Contains(criterion)).ToList()
                : query.ToList();
        }

        public List<MoodType> MoodWall(int limit = 50)
        {
            return _context.Post
                    .OrderByDescending(p => p.CreateDate)
                    .Select(p => p.Mood)
                    .Take(limit)                    
                    .ToList();
        }
    }
}