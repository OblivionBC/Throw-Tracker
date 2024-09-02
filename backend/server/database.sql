CREATE DATABASE trackApp;
-- Person Practice Training Period
CREATE TABLE PERSON (
PRSN_RK  SERIAL PRIMARY KEY,
prsn_first_nm varchar(16) NOT NULL,
prsn_last_nm varchar(24) NOT NULL,
prsn_email varchar(30) NOT NULL
);

Create TABLE MEET(
MEET_RK  SERIAL PRIMARY KEY,
meet_nm varchar(24) NOT NULL,
meet_dt date NOT NULL,
meet_location varchar(24)  
)
ALTER TABLE MEET ADD COLUMN prsn_rk INTEGER;
ALTER TABLE MEET 
   ADD CONSTRAINT fk_prsn
   FOREIGN KEY (prsn_rk) 
   REFERENCES person(prsn_rk);


Create Table EVENT (
EVEN_RK   SERIAL PRIMARY KEY,
even_implement varchar(16) NOT NULL,
even_attempt_one float,
even_attempt_two float,
even_attempt_thr float,
even_attempt_for float,
even_attempt_fiv float,
even_attempt_six float
);
ALTER TABLE EVENT ADD COLUMN meet_rk INTEGER;
ALTER TABLE EVENT 
   ADD CONSTRAINT meet_rk
   FOREIGN KEY (meet_rk) 
   REFERENCES MEET(meet_rk);

Create Table EXERCISE (
  EXCR_RK   SERIAL PRIMARY KEY,     
  excr_nm varchar(32) NOT NULL,
  excr_reps integer NOT NULL,
  excr_sets integer NOT NULL,
  excr_weight float,
  excr_notes varchar(64)
)
ALTER TABLE EXERCISE ADD COLUMN trpe_rk INTEGER;
ALTER TABLE EXERCISE 
   ADD CONSTRAINT trpe_rk
   FOREIGN KEY (trpe_rk) 
   REFERENCES training_period(trpe_rk);

Create Table MEASURABLE (
  MEAS_RK   SERIAL PRIMARY KEY,     
  meas_id varchar(32) NOT NULL,
  meas_typ varchar(32) NOT NULL
)
ALTER TABLE MEASURABLE ADD COLUMN prac_rk INTEGER;
ALTER TABLE MEASURABLE add COLUMN meas_unit varchar(16)
alter table   ADD CONSTRAINT prac_rk
   FOREIGN KEY (prac_rk) 
   REFERENCES practice(prac_rk);

Create Table MEASUREMENT (
  MSRM_RK   SERIAL PRIMARY KEY,     
  msrm_value float
);
ALTER TABLE MEASUREMENT ADD COLUMN prac_rk INTEGER;
ALTER TABLE MEASUREMENT add COLUMN meas_rk INTEGER;
ALTER TABLE MEASUREMENT ADD CONSTRAINT prac_rk
   FOREIGN KEY (prac_rk) 
   REFERENCES practice(prac_rk);
 ALTER TABLE MEASUREMENT  ADD CONSTRAINT meas_rk
   FOREIGN KEY (meas_rk) 
   REFERENCES measurable(meas_rk);


Create Table PRACTICE(
PRAC_RK      SERIAL PRIMARY KEY,
prac_best float,
prac_implement varchar(32) NOT NULL,
prac_implement_weight float NOT NULL,
prac_dt date NOT NULL
);
ALTER TABLE practice ADD COLUMN trpe_rk INTEGER;
ALTER TABLE practice 
   ADD CONSTRAINT fk_trpe
   FOREIGN KEY (TRPE_RK) 
   REFERENCES training_period(TRPE_RK);

Create Table TRAINING_PERIOD (
  TRPE_RK      SERIAL PRIMARY KEY,      
  trpe_start_dt date NOT NULL,
   trpe_end_dt date
);
ALTER TABLE TRAINING_PERIOD ADD COLUMN prsn_rk INTEGER;
ALTER TABLE TRAINING_PERIOD 
   ADD CONSTRAINT fk_prsn
   FOREIGN KEY (prsn_rk) 
   REFERENCES person(prsn_rk);

