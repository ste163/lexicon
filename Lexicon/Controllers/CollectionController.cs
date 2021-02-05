﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using Lexicon.Repositories;
using Lexicon.Controllers.Utils;
using Lexicon.Models;
using Lexicon.Models.ViewModels;

namespace Lexicon.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CollectionController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly ICollectionRepository _collectionRepo;
        private readonly IProjectCollectionRepository _projColRepo;
        private readonly ControllerUtils _utils;

        public CollectionController(IUserRepository userRepo, ICollectionRepository collectionRepo, IProjectCollectionRepository projColRepo)
        {
            _userRepo = userRepo;
            _collectionRepo = collectionRepo;
            _projColRepo = projColRepo;
            _utils = new ControllerUtils(_userRepo);
        }

        [HttpGet]
        public IActionResult GetByUserId()
        {           
            var firebaseUser = _utils.GetCurrentUser(User);

            // If this person is an anonymous user, return NotFound
            if (firebaseUser == null)
            {
                return NotFound();
            }

            List<Collection> collections = _collectionRepo.Get(firebaseUser.Id);

            if (collections == null)
            {
                return NotFound();
            }

            return Ok(collections);
        }

        [HttpGet("{id}")]
        public IActionResult GetByCollectionId(int id)
        {
            var firebaseUser = _utils.GetCurrentUser(User);

            // If this person is an anonymous user, return NotFound
            if (firebaseUser == null)
            {
                return NotFound();
            }

            Collection collection = _collectionRepo.GetByCollectionId(id);

            // If no matching collection, return not found
            if (collection == null)
            {
                return NotFound();
            }

            // If this is not that user's post, don't return it
            if (collection.UserId != firebaseUser.Id)
            {
                return NotFound();
            }

            // When I get my Words working, I'll have to ensure I'm also bringing back the full word list
            return Ok(collection);
        }

        [HttpPost]
        public IActionResult Add(CollectionFormViewModel collectionForm)
        {
            // For the Add, do not need to check for if the projectCollections are in the db
            // because this Collection is unique, there can be no duplicates.

            var firebaseUser = _utils.GetCurrentUser(User);

            // Check to ensure an unauthorized user (anonymous account) can not add a collection
            if (firebaseUser == null)
            {
                return NotFound();
            }

            // Ensure the userId on the incoming collection matches the person making the request
            if (collectionForm.Collection.UserId != firebaseUser.Id)
            {
                return BadRequest();
            }

            // Get all of this user's collections
            var allCollections = _collectionRepo.Get(firebaseUser.Id);

            // see if the name of the incoming collection is in the db
            var collectionWithThatName = allCollections.Find(c => c.Name == collectionForm.Collection.Name);

            // if there is a returned collection, we can't add because name isn't unique for this user
            if (collectionWithThatName != null)
            {
                return NotFound();
            }

            // Need to add the default requirements for the collection here
            collectionForm.Collection.CategorizationId = 1;
            collectionForm.Collection.CreationDate = DateTime.Now;

            try
            {
                _collectionRepo.Add(collectionForm.Collection);

                // After we add the collection, assign the collection id to each projectCollection
                foreach (var projectCollection in collectionForm.ProjectCollections)
                {
                    projectCollection.CollectionId = collectionForm.Collection.Id;
                }

                // Add ProjectCollections
                _projColRepo.Add(collectionForm.ProjectCollections);
                
                return Ok(collectionForm);
            }
            catch (DbUpdateException e)
            {
                return NotFound();
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, CollectionFormViewModel collectionForm)
        {
            // Get current user
            var firebaseUser = _utils.GetCurrentUser(User);

            // Ensure an unauthorized user (anonymous account) can not update
            if (firebaseUser == null)
            {
                return NotFound();
            }

            // Collection Id coming from URL must match the Collection object's Id
            if (id != collectionForm.Collection.Id)
            {
                return BadRequest();
            }

            // Get Collection by Id to ensure it's in db
            var collectionToUpdate = _collectionRepo.GetByCollectionId(id);

            // If it wasn't in the db don't let them update
            if (collectionToUpdate == null)
            {
                return NotFound();
            }

            // Get all of this user's collections
            var allCollections = _collectionRepo.Get(firebaseUser.Id);

            // see if the name of the incoming collection is in the db
            var collectionWithThatName = allCollections.Find(c => c.Name == collectionForm.Collection.Name);

            // if there is a returned collection, we can't add because name isn't unique for this user
            if (collectionWithThatName != null)
            {
                return NotFound();
            }

            // Get Collection's owner to ensure this is current user's collection
            var collectionOwner = collectionToUpdate.UserId;
            // Check if incoming user is the same one requesting deletion
            if (collectionOwner != firebaseUser.Id)
            {
                return NotFound();
            }

            // ** At this point, we know the person is able to update the collection.
           
            // Get projectCollections for this current collection
            var projectCollectionsInDb = _projColRepo.GetByCollectionId(collectionForm.Collection.Id);

            // Create an empty to list to store all possible projects to link to
            var projectCollectionsToUpdate = new List<ProjectCollection>();

            // Loop through what's in the db and check against what's incoming
            foreach (var pcInDb in projectCollectionsInDb)
            {
                foreach (var pcIncoming in collectionForm.ProjectCollections)
                {
                    // If pc in Db doesn't equal the incoming pc, add it to the update list
                    if (pcInDb.ProjectId != pcIncoming.ProjectId)
                    {
                        projectCollectionsToUpdate.Add(pcIncoming);
                    }
                }
            }

            // By using the collectionToUpdate we retrieved from the db,
            // we re-assign its values that are editable, based on the incoming collection
            collectionToUpdate.Name = collectionForm.Collection.Name;
            collectionToUpdate.Description = collectionForm.Collection.Description;

            try
            {
                _collectionRepo.Update(collectionToUpdate);
                _projColRepo.Add(projectCollectionsToUpdate);
                return NoContent();
            }
            catch (DbUpdateException e)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // Get current user
            var firebaseUser = _utils.GetCurrentUser(User);

            // Check to ensure an unauthorized user (anonymous account) can not delete
            if (firebaseUser == null)
            {
                return NotFound();
            }

            // Get Collection by Id
            var collectionToDelete = _collectionRepo.GetByCollectionId(id);

            //Ensure we have this Collection
            if (collectionToDelete == null)
            {
                return NotFound();
            }

            // Get Collection's owner
            var collectionOwner = collectionToDelete.UserId;
            // Check if incoming user is the same one requesting deletion
            if (collectionOwner != firebaseUser.Id)
            {
                return NotFound();
            }

            // If you pass all those, you're the Collection owner and can delete it
            _collectionRepo.Delete(collectionToDelete);
            return NoContent();
        }
    }
}
