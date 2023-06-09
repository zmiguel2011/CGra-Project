#ifdef GL_ES
precision highp float;
#endif

struct lightProperties {
    vec4 position;                  
    vec4 ambient;                   
    vec4 diffuse;                   
    vec4 specular;                  
    vec4 half_vector;
    vec3 spot_direction;            
    float spot_exponent;            
    float spot_cutoff;              
    float constant_attenuation;     
    float linear_attenuation;       
    float quadratic_attenuation;    
    bool enabled;                   
};

uniform sampler2D scalesSampler;
uniform float ratio;
uniform lightProperties uLight[8];
uniform float r;
uniform float g;
uniform float b;

varying vec2 vTextureCoord;

void main() {
    vec4 color = texture2D(scalesSampler, vTextureCoord) * uLight[0].diffuse + texture2D(scalesSampler, vTextureCoord) * uLight[0].ambient;
    if (vTextureCoord.y > ratio)
        gl_FragColor = color;
    else
        gl_FragColor = vec4(r, g, b, 1.0) * uLight[0].diffuse + vec4(r, g, b, 1.0) * uLight[0].ambient;
}