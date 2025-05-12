<template>
    <div id="particles-js" class="particles-container"></div>
</template>
<script>
import 'particles.js';

particlesJS.load('particles.js',{/* config */});

export default{ 
    mounted() {
        this.initParticles()
    },
    methods: {
        initParticles() {
            window.particlesJS('particles-js',{
                particles: {
                    number : {value:80,density: {enable:true,value_area:800}},
                    color : { value: "#42b983"},
                    shape : {type:"circle"},
                    opacity : {value: 0.5,random:true},
                    size : {value:3,random:true},
                    line_linked : {enable:true,distance:150,color:"#42b983",opacity:0.4,width:1},
                    move : {enable:true,speed:3,direction:"none",random:false,straight:false},
                },
                interactivity : {
                    detect_on : "canvas",
                    events : {enable:true,mode:"repulse" },
                    onclick: {enable: true,mode: "push"}
                }
            });
        },
    },
};
</script>

<style scoped> 
.particles-container {
    position : fixed;
    top : 0;
    left : 0;
    width : 100%;
    height: 100%;
    z-index : -1; 
    background: transparent;
}
</style>
