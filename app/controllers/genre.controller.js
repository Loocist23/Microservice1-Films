const Genre = require('../models/Genre');

module.exports = {
    findAll: async (req, res) => {
        res.json(await Genre.findAll())
    },

    find: async (req, res) => {
        const id = req.params.id

        try {
            const genre = await Genre.findByPk(id)

            if(!genre) {
                return res.status(400).json({
                    success: false,
                    error: "Genre not found"
                })
            }

            return res.json({
                success: true,
                data: genre
            })
        } catch (e) {
            res.json({
                success: false,
                error: 'Error : ' + e
            })
        }
    },

    create: async(req, res) => {
        try {
            const genre = await Genre.create(req.body)

            return res.json({
                success: true,
                data: genre
            })
        } catch (e) {
            throw new Error('Error : ' + e)
        }
    },

    update: async(req, res) => {
        const id = req.params.id

        try {
            const genre = await Genre.findByPk(id)

            if(!genre) {
                return res.json({
                    success: false,
                    error: "Genre not found"
                })
            }

            await genre.update(req.body)

            return res.json({
                success: true,
                data: genre
            })

        } catch (e) {
            return res.status(500).json({
                success: false,
                error: 'Error : ' + e,
            });
        }
    },

    delete: async (req, res) => {
        const id = req.params.id

        try {
            const genre = await Genre.findByPk(id)

            if(!genre) {
                return res.json({
                    success: false,
                    error: "Genre not found"
                })
            }

            await genre.destroy()

            return res.json({
                success: true
            })

        } catch (e) {
            return res.status(500).json({
                success: false,
                error: 'Error : ' + e
            })
        }
    }
}