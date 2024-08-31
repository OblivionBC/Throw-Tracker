INSERT INTO person(prsn_first_nm, prsn_last_nm, prsn_email) 
VALUES ('Gideon', 'Charles', 'gideon@gmail.com'), ('Starscourge', 'Radahn', 'radahn@gmail.com'), ('Queen', 'Marika', 'qmarika@gmail.com');

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
  ( 68.34, 14, 6);

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
  trpe_rk)
VALUES
    ('Bench Press', 4, 3, 225, '10 reps, 3 sets, 135 lbs', 1),
    ('Half Squat', 8, 3, 220, '10 reps, 3 sets, 135 lbs', 1),
    ('Romanian Deadlift', 6, 3, 160, '10 reps, 3 sets, 135 lbs', 1),
    ('Incline Bench Press', 4, 3, 180, '10 reps, 3 sets, 135 lbs', 2),
    ('Full Squat', 8, 3, 300, '10 reps, 3 sets, 135 lbs', 2),
    ('Deadlift', 8, 3, 350, '10 reps, 3 sets, 135 lbs', 2),
    ('Decline Bench Press', 4, 3, 190, '10 reps, 3 sets, 135 lbs', 4),
    ('Quarter Squat', 6, 3, 325, '10 reps, 3 sets, 135 lbs', 4),
    ('Romaian Deadlift', 8, 3, 170, '10 reps, 3 sets, 135 lbs', 4);

  