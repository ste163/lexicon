﻿// Written by NSS
// Creates the fake database for running Repo tests
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Lexicon.Data;

namespace Tabloid_Fullstack.Tests
{
    public class TestDbContext : ApplicationDbContext
    {
        public TestDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Model.GetEntityTypes()
                .Where(e => !e.IsOwned())
                .SelectMany(e => e.GetForeignKeys())
                .ToList()
                .ForEach(relationship => relationship.DeleteBehavior = DeleteBehavior.Restrict);
        }
    }

    public abstract class EFTestFixture : IDisposable
    {
        // Sets database to in memory
        // Use SQL Lite because this is a small amount of data
        private const string _connectionString = "DataSource=:memory:";
        private readonly SqliteConnection _connection;

        protected readonly TestDbContext _context;

        protected EFTestFixture()
        {
            _connection = new SqliteConnection(_connectionString);
            _connection.Open();
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                    .UseSqlite(_connection)
                    .Options;
            _context = new TestDbContext(options);
            _context.Database.EnsureCreated();

        }

        public void Dispose()
        {
            _connection.Close();
        }
    }
}