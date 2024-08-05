INSERT INTO person(prsn_first_nm, prsn_last_nm, prsn_email) 
VALUES ('Gideon', 'Charles', 'gideon@gmail.com'), ('Starscourge', 'Radahn', 'radahn@gmail.com'), ('Queen', 'Marika', 'qmarika@gmail.com');

INSERT INTO training_period ( trpe_start_dt, trpe_end_dt, prsn_rk)
VALUES ( '2023-11-23', '2023-12-26', 1),
 ( '2024-01-08', '2024-02-15', 1),
  ( '2024-02-20', '2024-03-21', 1);

INSERT INTO practice ( trpe_start_dt, trpe_end_dt, prsn_rk)
VALUES ( '2023-11-23', '2023-12-26', 1),
 ( '2024-01-08', '2024-02-15', 1),
  ( '2024-02-20', '2024-03-21', 1);

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

CREATE DATABASE trackApp;

CREATE TABLE PERSON (
PRSN_RK  SERIAL PRIMARY KEY,
prsn_first_nm varchar(16) NOT NULL,
prsn_last_nm varchar(24) NOT NULL,
prsn_email varchar(30) NOT NULL
);

TABLE MEET(
MEET_RK  SERIAL PRIMARY KEY,
meet_nm varchar(24) NOT NULL,
meet_dt date NOT NULL,
meet_location varchar(24),
CONSTRAINT PRSN_RK   
    FOREIGN KEY(PRSN_RK)
    REFERENCES person(PRSN_RK)  
)


Table EVENT (
EVEN_RK   SERIAL PRIMARY KEY,
even_implement varchar(16) NOT NULL,
even_attempt_one float (even_attempt_one >= 0),
even_attempt_two float (even_attempt_two >= 0),
even_attempt_thr float (even_attempt_thr >= 0),
even_attempt_for float (even_attempt_for >= 0),
even_attempt_fiv float (even_attempt_fiv >= 0),
even_attempt_six float (even_attempt_six >= 0),
CONSTRAINT MEET_RK   
    FOREIGN KEY(MEET_RK)
    REFERENCES meet(MEET_RK)
)    

Table PRACTICE(
PRAC_RK      SERIAL PRIMARY KEY,
prac_best float,
prac_implement varchar(32) NOT NULL,
prac_implement_weight float NOT NULL,
prac_dt date NOT NULL
);
ALTER TABLE practice 
   ADD CONSTRAINT fk_trpe
   FOREIGN KEY (TRPE_RK) 
   REFERENCES training_period(TRPE_RK);

Table TRAINING_PERIOD (
  TRPE_RK      SERIAL PRIMARY KEY,      
  trpe_start_dt date NOT NULL,
   trpe_end_dt date
)
ALTER TABLE TRAINING_PERIOD 
   ADD CONSTRAINT fk_prsn
   FOREIGN KEY (PRSN_RK) 
   REFERENCES person(prsn_rk);

Table EXERCISE (
  EXCR_RK   SERIAL PRIMARY KEY,     
  excr_nm varchar(32) NOT NULL,
  excr_reps integer NOT NULL (excr_reps >= 0),
  excr_sets integer NOT NULL (excr_sets >= 0),
  excr_weight float,
  excr_notes varchar(64),
  CONSTRAINT PRAC_RK   
    FOREIGN KEY(PRAC_RK)
    REFERENCES practice(PRAC_RK)
)