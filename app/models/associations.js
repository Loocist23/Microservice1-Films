const Film = require('./Film');
const Genre = require('./Genre');
const AgeRating = require('./AgeRating');

Film.belongsTo(AgeRating, {
    as: 'ageRating',
    foreignKey: 'ageRatingId'
});
AgeRating.hasMany(Film, {
    as: 'films',
    foreignKey: 'ageRatingId'
});

Film.belongsToMany(Genre, {
    as: 'genres',
    foreignKey: {
        name: 'filmId',
        field: 'film_id'
    },
    otherKey: {
        name: 'genreId',
        field: 'genre_id'
    },
    through: {
        model: 'film_genres',
        timestamps: true
    }
});
Genre.belongsToMany(Film, {
    as: 'films',
    foreignKey: {
        name: 'genreId',
        field: 'genre_id'
    },
    otherKey: {
        name: 'filmId',
        field: 'film_id'
    },
    through: {
        model: 'film_genres',
        timestamps: true
    }
});
