﻿using Moq;
using Xunit;
using Lexicon.Models;
using Lexicon.Repositories;
using Lexicon.Controllers;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Lexicon.Tests.Controllers
{
    public class CollectionControllerTests
    {
        private Mock<IUserRepository> _fakeUserRepo;
        private Mock<ICollectionRepository> _fakeCollectionRepo;

        public CollectionControllerTests()
        {
            // Spoof a User Repo
            _fakeUserRepo = new Mock<IUserRepository>();
            // Whenever this GetByFirebaseUserId is called, return user with Id 1
            _fakeUserRepo.Setup(r => r.GetByFirebaseUserId("FIREBASE_USER1")).Returns(new User() { Id = 1, Email = "pennywise@it.com" });
            // Whenever this GetByFirebaseUserId is called, return user with Id 2
            _fakeUserRepo.Setup(r => r.GetByFirebaseUserId("FIREBASE_USER2")).Returns(new User() { Id = 2, Email = "bobgray@it.com" });

            // Spoof a Collection Repo
            // You do not have to have the full object coming back with all the required NOT NULL, etc.
            // We are not faking a db, just the items that would come out of it.
            _fakeCollectionRepo = new Mock<ICollectionRepository>();
            _fakeCollectionRepo.Setup(r => r.Get(It.Is<int>(i => i == 1))).Returns((int id) => new List<Collection>() { new Collection() { Id = id, Name = "Scary places", Description = "Spooky places It probably hangs at.",} });
        }

        [Fact]
        public void Registered_User_Can_Get_Posts()
        {

        }

        [Fact]
        public void Anonymous_User_Can_Not_Get_Posts()
        {

        }

        [Fact]
        public void If_User_Has_No_Posts_Return_NotFound()
        {

        }
    }
}
