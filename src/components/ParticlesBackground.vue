<template>
    <Particles
        id="tsparticles"
        class="particles-background"
        :particlesInit = "particlesInit"
        :particlesLoaded="particlesLoaded"
        :options="particlesOptions"
    />
</template>
<script>
import {loadSlim} from "tsparticles-slim";


export default {
  name: "ParticlesBackground",
  data() {
    return {
      particlesOptions: {
        // Your particles.js configuration can be adapted here.
        // Visit https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_IOptions.IOptions.html
        // for all tsparticles options.
        background: {
          color: {
            value: 'transparent' // Or your desired background for the canvas itself
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push',
            },
            onHover: {
              enable: true,
              mode: 'repulse',
            },
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: '#ffffff', // Color of the particles
          },
          links: {
            color: '#ffffff', // Color of the links between particles
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 2, // Speed of particles
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 80, // Number of particles
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
      }
    };
  },
  methods: {
    async particlesInit(engine) {
      await loadSlim(engine); // if you installed "tsparticles-slim"
      console.log("Particles engine initialized");
    },
    async particlesLoaded(container) {
        console.log("Particles container loaded",container);
    }
    },
};
</script>

<style scoped> 
.particles-background {
    position : fixed;
    top : 0;
    left : 0;
    width : 100%;
    height: 100%;
    z-index : -1; 
    background: transparent;
}
</style>
