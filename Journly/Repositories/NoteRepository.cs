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
    public class NoteRepository
    {
        private readonly ApplicationDbContext _context;

        public NoteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //returns a note with a specific ID
        public Note GetById(int id)
        {
            return _context.Note
                        .Include(n => n.Therapist)
                        .Include(n => n.Client)
                        .FirstOrDefault(n => n.Id == id);
        }

        //gets all notes by a therapist's user ID
        public List<Note> GetByTherapistId(int id)
        {
            return _context.Note
                        .Include(n => n.Client)
                        .Where(n => n.TherapistId == id)
                        .OrderByDescending(n => n.CreateDate)
                        .ToList();
        }

        //gets all notes by a client's user ID
        public List<Note> GetByClientId(int id)
        {
            return _context.Note
                        .Where(n => n.ClientId == id)
                        .OrderByDescending(n => n.CreateDate)
                        .ToList();
        }

        //adds a new note to the db
        public void Add(Note note)
        {
            _context.Add(note);
            _context.SaveChanges();
        }

        //updates a specific note in the db
        public void Update(Note note)
        {
            _context.Entry(note).State = EntityState.Modified;
            _context.SaveChanges();
        }

    }
}