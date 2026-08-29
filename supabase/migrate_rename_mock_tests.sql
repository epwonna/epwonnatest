-- =====================================================================
-- One-off migration: run this ONLY if you already created the old
-- `mock_tests` table (from an earlier version of schema.sql) and want
-- to rename it to `tests` without losing your data.
--
-- Renaming a table in Postgres is safe: rows, indexes, RLS policies,
-- and the foreign key from `questions` all follow the table
-- automatically (they're tracked internally, not by name) — nothing
-- else needs to change on the database side.
--
-- If you're setting up a fresh project, skip this file — schema.sql
-- already creates the table as `tests`.
-- =====================================================================

alter table if exists public.mock_tests rename to tests;

-- Cosmetic only (safe to skip) — renames the index/policies too so
-- their names match the new table name in the dashboard.
alter index if exists mock_tests_exam_key_idx rename to tests_exam_key_idx;
alter policy if exists "mock_tests: public read" on public.tests rename to "tests: public read";
alter policy if exists "mock_tests: admin write" on public.tests rename to "tests: admin write";
