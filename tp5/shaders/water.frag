#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSamplerWater;
uniform sampler2D uSamplerWaterMap;
uniform float timeFactor;
varying float verticalOffset;

void main() {
	vec4 color = texture2D(uSamplerWater, vTextureCoord+vec2((timeFactor *.01),(timeFactor *.01)));
	if (verticalOffset < 0.05)
        color.rgb /= 1.05 + verticalOffset * (1.0 - verticalOffset) * 6.5;
	gl_FragColor = color;
}