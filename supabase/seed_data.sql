-- Seed Departments and Job Levels for CAAN
DO $$
DECLARE
    caan_id UUID;
    noc_id UUID;
    nt_id UUID;
BEGIN
    SELECT id INTO caan_id FROM organizations WHERE code = 'CAAN';
    SELECT id INTO noc_id FROM organizations WHERE code = 'NOC';
    SELECT id INTO nt_id FROM organizations WHERE code = 'NT';

    -- CAAN Departments
    INSERT INTO departments (organization_id, name, code) VALUES 
    (caan_id, 'Flight Safety Standard Department', 'FSSD'),
    (caan_id, 'Air Navigation Service Department', 'ANSD'),
    (caan_id, 'Airport Operations Department', 'AOD');

    -- CAAN Job Levels
    INSERT INTO job_levels (organization_id, name, level_order) VALUES 
    (caan_id, 'Level 4 (Assistant)', 4),
    (caan_id, 'Level 5 (Senior Assistant)', 5),
    (caan_id, 'Level 6 (Officer)', 6),
    (caan_id, 'Level 7 (Senior Officer)', 7);

    -- NOC Departments
    INSERT INTO departments (organization_id, name, code) VALUES 
    (noc_id, 'Finance Department', 'FIN'),
    (noc_id, 'Operational Department', 'OPS'),
    (noc_id, 'Administration Department', 'ADMIN');

    -- NOC Job Levels
    INSERT INTO job_levels (organization_id, name, level_order) VALUES 
    (noc_id, 'Assistant Grade 4', 4),
    (noc_id, 'Officer Grade 6', 6),
    (noc_id, 'Manager Grade 8', 8);

    -- NT Departments
    INSERT INTO departments (organization_id, name, code) VALUES 
    (nt_id, 'Technical Department', 'TECH'),
    (nt_id, 'Customer Service Department', 'CSD'),
    (nt_id, 'IT Department', 'IT');

    -- NT Job Levels
    INSERT INTO job_levels (organization_id, name, level_order) VALUES 
    (nt_id, 'Fourth Level', 4),
    (nt_id, 'Sixth Level (Officer)', 6),
    (nt_id, 'Eighth Level (Manager)', 8);
END $$;
