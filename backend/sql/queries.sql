-- Person Practice Training Period
SELECT m.*, msrm.msrm_value FROM measurable m 
join practice p on p.prac_rk = m.prac_rk 
join training_period t on t.trpe_rk = p.trpe_rk 
join person prsn on prsn.prsn_rk = t.prsn_rk 
join measurement msrm on msrm.meas_rk = m.meas_rk where prac_rk = $1

SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name FROM person p 
inner join organization o on o.org_rk = p.org_rk WHERE p.coach_prsn_rk = 16 and o.org_name = 'University Of British Columbia';

      select * from training_period trpe where trpe.prsn_rk = 12 and trpe.trpe_start_dt <=  '2024-06-30' and trpe_rk = 4 and (trpe.trpe_end_dt >= '2024-06-30' OR trpe_end_dt is null)
      [prac_dt, prsn_rk, trpe_rk]

SELECT 
    p.prac_rk,
    p.prac_dt,
    COUNT(m.msrm_rk) AS measurement_count
FROM 
    practice p
LEFT JOIN 
    measurement m ON p.prac_rk = m.prac_rk
GROUP BY 
    p.prac_rk
ORDER BY 
    p.prac_rk;
    
select p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name 
from person p inner join organization o on o.org_rk = p.org_rk where p.prsn_email = $1 and p.prsn_pwrd = $2
    select (pswhash = crypt('pokemonbeach1', pswhash)) AS pswmatch from person

    SELECT p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name
  FROM person p
  inner join organization o on o.org_rk = p.org_rk
 WHERE p.prsn_email = 'gideon@gmail.com' 
   AND p.prsn_pwrd = crypt('mypass', p.prsn_pwrd);

   UPDATE person set prsn_role = 'COACH' where prsn_rk = 16;

BEGIN TRANSACTION;

DELETE FROM measurement WHERE prac_rk = 12;
DELETE FROM practice WHERE prac_rk = 12;

COMMIT;

--Make not null column nullable
ALTER TABLE practice
ALTER COLUMN prac_implement_weight DROP NOT NULL;


-- get measurables for prac
select m.* from measurement msrm inner join practice prac on prac.prac_rk = msrm.prac_rk 
inner join measurable m on m.meas_rk = msrm.meas_rk where msrm.prac_rk = 13;

 SELECT m.*, msrm.msrm_value from measurement msrm inner join measurable m on
  m.meas_rk = msrm.meas_rk where m.prsn_rk = 12

SELECT msrm.msrm_rk, msrm.prac_rk, msrm.msrm_value, m.meas_id, m.meas_unit, m.prsn_rk, p.prac_rk, p.trpe_rk
from measurement msrm
inner join measurable m on m.meas_rk = msrm.meas_rk 
inner join practice p on p.prac_rk = msrm.prac_rk 
where p.trpe_rk = ANY(ARRAY[1, 2])
order by p.prac_rk
;

--Training Period Start Date does not overlap Existing Training Periods


select * from training_period trpe where trpe.prsn_rk = $2 and trpe_start_dt <= $1 and trpe_end_dt >= $1;

select * from training_period trpe 
where trpe.prsn_rk = 11
    and trpe_start_dt <= '2023-09-21'
    and trpe_end_dt >= '2023-09-21';

select prog.prog_rk, prog.prog_nm, prog.coach_prsn_rk, exas.athlete_prsn_rk, 
    exas.assigner_prsn_rk, exas.exas_notes, excr.excr_nm, excr.excr_reps, 
    excr.excr_sets, excr.excr_weight, excr.excr_notes 
from program prog 
inner join exercise_assignment exas on prog.prog_rk = exas.prog_rk 
inner join exercise excr on excr.excr_rk = exas.excr_rk;
