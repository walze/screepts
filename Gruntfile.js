console.log(process.env.EMAIL);
console.log(process.env.TOKEN);

module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-screeps');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
		watch: {
			js: {
				files: './main.js',
				tasks: ['screeps'],
			},
		},
		screeps: {
			options: {
				email: process.env.EMAIL,
				token: process.env.TOKEN,
				branch: 'screepts',
				// Server: 'season'
			},
			dist: {
				src: ['main.js'],
			},
		},
	});
};
