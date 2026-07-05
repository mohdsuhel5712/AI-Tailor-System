CREATE TABLE body_measurements (
    body_id SERIAL PRIMARY KEY,

    height FLOAT,
    chest FLOAT,
    waist FLOAT,
    hip FLOAT,
    shoulder FLOAT,

    arm_length FLOAT,
    leg_length FLOAT,

    gender VARCHAR(20),
    body_shape VARCHAR(100),

    mesh_file VARCHAR(255)
);



CREATE TABLE body_meshes (
    mesh_id SERIAL PRIMARY KEY,

    body_id INTEGER REFERENCES body_measurements(body_id),

    obj_path TEXT,
    fbx_path TEXT,
    glb_path TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE garment_categories (
    category_id SERIAL PRIMARY KEY,

    category_name VARCHAR(100)
);


CREATE TABLE garments (
    garment_id SERIAL PRIMARY KEY,

    category_id INTEGER
        REFERENCES garment_categories(category_id),

    garment_name VARCHAR(100),

    obj_file TEXT,
    fbx_file TEXT,
    glb_file TEXT,

    texture_file TEXT,

    size VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE fabrics (

    fabric_id SERIAL PRIMARY KEY,

    fabric_name VARCHAR(100),

    roughness FLOAT,

    reflectance FLOAT,

    wrinkle_factor FLOAT,

    elasticity FLOAT,

    texture_path TEXT
);


CREATE TABLE garment_fabric_mapping (

    mapping_id SERIAL PRIMARY KEY,

    garment_id INTEGER
        REFERENCES garments(garment_id),

    fabric_id INTEGER
        REFERENCES fabrics(fabric_id)
);


-- 'C:\Users\mohds\OneDrive\Desktop\FASH_SHOP\database\schema.sql'