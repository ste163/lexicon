﻿using Lexicon.Data;
using Lexicon.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Lexicon.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<User> Get()
        {
            return _context.User.ToList();
        }

        public void Add(User user)
        {
            throw new NotImplementedException();
        }

        public void Delete(User user)
        {
            throw new NotImplementedException();
        }

        public User GetByFirebaseUserId(string firebaseUserId)
        {
            // Currently not bringing List of Projects or List of Collections
            // I will do that when I absolutely have to.
            return _context.User
                .FirstOrDefault(u => u.FirebaseUserId == firebaseUserId);
        }
    }
}
