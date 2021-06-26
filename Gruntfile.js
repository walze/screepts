module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-screeps');

	grunt.initConfig({
		screeps: {
			options: {
				email: 'catufuzgu@gmail.com',
				token: '5f6e4ab0-f3cc-4224-81e2-4dc183a81822',
				branch: 'screepts',
				// Server: 'season'
			},
			dist: {
				src: ['main.js'],
			},
		},
	});
};
