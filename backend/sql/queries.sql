-- Person Practice Training Period
SELECT m.*, msrm.msrm_value FROM measurable m 
join practice p on p.prac_rk = m.prac_rk 
join training_period t on t.trpe_rk = p.trpe_rk 
join person prsn on prsn.prsn_rk = t.prsn_rk 
join measurement msrm on msrm.meas_rk = m.meas_rk where prac_rk = $1

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