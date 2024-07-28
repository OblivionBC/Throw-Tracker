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

Table PRACTICE (
PRAC_RK      SERIAL PRIMARY KEY,
prac_best float (prac_best >= 0),
prac_implement varchar(32) NOT NULL,
prac_implement_weight float NOT NULL,
prac_dt date NOT NULL,
CONSTRAINT TRPE_RK   
    FOREIGN KEY(TRPE_RK)
    REFERENCES training_period(TRPE_RK)
)

Table TRAINING_PERIOD (
  TRPE_RK      SERIAL PRIMARY KEY,      
  trpe_start_dt date NOT NULL,
   trpe_end_dt date,
  CONSTRAINT PRSN_RK 
    FOREIGN KEY(PRSN_RK)
    REFERENCES person(PRSN_RK)
)


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