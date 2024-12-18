update person set org_rk = 1 where prsn_rk > 0;
Update person set prsn_pwrd = crypt('pokemonbeach1', gen_salt('bf')) where prsn_rk = 11;
--Insert into practice
INSERT INTO practice (prac_dt, trpe_rk) VALUES
('2024-09-23', 10),
('2024-09-24', 10),
('2024-09-26', 10),
('2024-09-27', 10),
('2024-10-01', 10),
('2024-10-03', 10),
('2024-10-07', 10),
('2024-10-08', 10),
('2024-10-10', 10),
('2024-10-11', 10),
('2024-10-16', 10),
('2024-10-17', 10);

--Insert into measurements
INSERT INTO measurement (msrm_value, meas_rk, prac_rk) VALUES
(1.35, 13, 34),
(1.48, 13, 35),
(1.27, 13, 36),
(1.45, 13, 37),
(1.44, 13, 38),
(1.4, 13, 39),
(1.44, 13, 40),
(1.37, 13, 41),
(1.37, 13, 42),
(1.22, 13, 43);

INSERT INTO measurement (msrm_value, meas_rk, prac_rk) VALUES
(1.34, 14, 34),
(1.34, 14, 35),
(1.23, 14, 36),
(1.38, 14, 37),
(1.39, 14, 38),
(1.35, 14, 39),
(1.33, 14, 40),
(1.3, 14, 41),
(1.29, 14, 42),
(1.17, 14, 43),
(1.36, 14, 44);

INSERT INTO person (prsn_first_nm, prsn_last_nm, prsn_email, prsn_pwrd, org_rk, prsn_role) 
VALUES('Gideon', 'Charles', 'gideon@gmail.com', crypt('mypass', gen_salt('bf')), 1, 'ATHLETE') RETURNING *

INSERT INTO organization( org_name, org_code, org_type)
VALUES ( 'University Of British Columbia', 'UBC', 'UNIVERSITY');

INSERT INTO training_period ( trpe_start_dt, trpe_end_dt, prsn_rk)
VALUES ( '2023-11-23', '2023-12-26', 1),
 ( '2024-01-08', '2024-02-15', 1),
  ( '2024-02-20', '2024-03-21', 1);

INSERT INTO practice ( prac_start_dt, prac_end_dt, prsn_rk)
VALUES ( '2023-11-23', '2023-12-26', 1),
 ( '2024-01-08', '2024-02-15', 1),
  ( '2024-02-20', '2024-03-21', 1);

  INSERT INTO MEASURABLE ( meas_id, meas_typ, prac_rk, meas_unit)
VALUES ( 'Benchpress Speed', 'Specific Preparatory', 11, 'm/s'),
 ( '1.75kg Discus Throw', 'Competitive', 11, 'm/s'),
  ( 'Overhead 16lb Shotput Toss', 'Specific Developmental', 12, 'm'),
  ( 'Standing Bound', 'General', 12, 'm'),
  ('Squat Jump', 'Specific Preparatory', 14, 'm/s'),
  ('2kg Hammer Throw', 'Competitive', 14, 'm/s'),
  ('Med Ball Chest Pass', 'Specific Developmental', 16, 'm'),
  ('400m Run', 'General', 13, 's'),
  ('Power Clean', 'Specific Preparatory', 15, 'm/s'),
  ('600g Javelin Throw', 'Competitive', 13, 'm/s'),
  ('Single-leg Hop', 'Specific Developmental', 16, 'm'),
  ('Push-up', 'General', 16, 'reps')
  ;

  INSERT INTO MEASUREMENT ( msrm_value, prac_rk, meas_rk)
VALUES ( 1.6, 12, 1),
  ( 46.2, 11, 2),
  ( 68.34, 14, 6),
  ( 60, 13, 8),
  ( 24, 29, 12),
  ( 22, 12, 12),
  ( 28, 18, 12),
  ( 29, 15, 12),
  ( 1.9, 14, 1);

INSERT INTO practice (prac_best, prac_implement, prac_implement_weight, prac_dt, trpe_rk)
VALUES
    (39.42, 'Discus', 1.75, '2023-11-23', 1),
    (14.2, 'Shot Put', 7.26, '2023-11-24', 1),
    (59.1, 'Javelin', 800, '2023-11-25', 1),
    (46.3, 'Hammer Throw', 7.26, '2023-11-26', 1),
    (34.12, 'Discus', 1.75, '2023-11-27', 1),
    (17, 'Shot Put', 7.26, '2023-11-29', 1),
    (50, 'Javelin', 800, '2023-11-30', 1),
    (42, 'Hammer Throw', 7.26, '2023-11-23', 1),
    (38.94, 'Discus', 1.75, '2023-12-01', 1),
    (17.2, 'Shot Put', 7.26, '2023-11-02', 1);
--Meet, Event and Exercise
--
INSERT INTO meet (
meet_nm,
meet_dt,
meet_location,
prsn_rk )
VALUES ( 'UBC Open', '2023-11-23', 'UBC', 1),
( 'Dogwood', '2023-11-24', 'Victoria', 1),
( 'SFU High Performance 1', '2023-11-25', 'SFU', 1),
( 'SFU High Performance 2', '2023-11-26', 'SFU', 1),
( 'Throwsfest', '2023-11-27', 'Kamloops', 1),
( 'Big Kahuna', '2023-11-28', 'Richmond', 1),
( 'Garriock', '2023-11-29', 'Duncan', 1),
( 'BC Jamboree', '2023-11-30', 'Nanaimo', 1),
( 'Canadian Nationals', '2023-12-01', 'Montreal', 1);

INSERT INTO event (
even_implement,
even_attempt_one,
even_attempt_two,
even_attempt_thr,
even_attempt_for,
even_attempt_fiv,
even_attempt_six,
meet_rk)
VALUES  
    ('Discus', 39.42, 39.42, 39.42, 39.42, 39.42, 39.42, 1),
    ( 'Shot Put', 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 1),
    ( 'Javelin', 59.1, 59.1, 59.1, 59.1, 59.1, 59.1, 2),
    ( 'Hammer Throw', 46.3, 46.3, 46.3, 46.3, 46.3, 46.3, 2),
    ( 'Discus', 34.12, 34.12, 34.12, 34.12, 34.12, 34.12, 3),
    ( 'Shot Put', 17, 17, 17, 17, 17, 17, 3),
    ( 'Javelin', 50, 50, 50, 50, 50, 50, 4),
    ( 'Hammer Throw', 42, 42, 42, 42, 42, 42, 6),
    ( 'Discus', 38.94, 38.94, 38.94, 38.94, 38.94, 38.94, 6),
    ( 'Shot Put', 17.2, 17.2, 17.2, 17.2, 17.2, 17.2, 6);


INSERT INTO exercise (
excr_nm,
  excr_reps,
  excr_sets,
  excr_weight,
  excr_notes,
  coach_prsn_rk)
VALUES
    ('Bench Press', 4, 3, 225, 'Go for speed', 16),
    ('Half Squat', 8, 3, 220, 'Slow on the eccentric, then fast', 16),
    ('Romanian Deadlift', 6, 3, 160, 'Go light', 16),
    ('Incline Bench Press', 4, 3, 180, '', 16),
    ('Full Squat', 8, 3, 300, 'Ass to grass Si vous plaits', 16),
    ('Deadlift', 8, 3, 350, 'Dont you dare try sumo', 16),
    ('Decline Bench Press', 4, 3, 190, 'upside down', 16),
    ('Quarter Squat', 6, 3, 325, 'load up to 325 with 70%, 80%, 90% then 100', 16),
    ('Romaian Deadlift', 8, 3, 170, '', 16);

  INSERT INTO program (prog_nm, coach_prsn_rk, trpe_rk) VALUES
('Discus Program', 16, 1),
('Shotput', 16, 1);

INSERT INTO exercise_assignment (
  prog_rk,
  athlete_prsn_rk,
  assigner_prsn_rk,
  excr_rk)
VALUES
    (1, 12, 16, 13),
    (1, 12, 16, 14),
    (1, 12, 16, 15),
    (2, 12, 16, 16),
    (2, 12, 16, 17),
    (2, 12, 16, 21);