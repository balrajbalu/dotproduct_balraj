const categoryModel = require('../models/categories');

exports.getCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, name, type } = req.body;
        const query = { userId: req.user.id };
        if (name) {
            query.name = { $regex: name, $options: 'i' }; 
        }

        if (type) {
            query.type = type;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [data, total] = await Promise.all([
            categoryModel.find(query).skip(skip).limit(parseInt(limit)),
            categoryModel.countDocuments(query)
        ]);
        return res.status(200).json({
            result: 1,
            message: 'Categories fetched successfully.',
            data,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ result: 0, message: 'Internal Server Error' });
    }
};
exports.getCategoriesList = async (req, res) => {
    try {
        const query = { userId: req.user.id };
        const data = await categoryModel.find(query,  {_id:1, name: 1, type: 1});
        return res.status(200).json({
            result: 1,
            message: 'Categories fetched successfully.',
            data,
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ result: 0, message: 'Internal Server Error' });
    }
};


exports.createCategory = async (req, res) => {
    try {
        const { name, type, description } = req.body;

        if (!name || !type ) {
            return res.status(400).json({ result: 0, message: 'Missing required fields.' });
        }

        const newCategory = new categoryModel({
            userId: req.user.id,
            name,
            type,
            description
        });

        const savedCategory = await newCategory.save();

        return res.status(201).json({
            result: 1,
            message: 'Category created successfully.',
            data: savedCategory
        });

    } catch (error) {
        console.error('Error creating :', error.message);
        return res.status(500).json({
            result: 0,
            message: 'Internal server error.'
        });
    }
};
