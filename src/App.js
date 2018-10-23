import React, { Component } from 'react';
import './App.css';
import 'typeface-roboto';
import * as three from 'three'
import Orbit from 'three-orbit-controls'

import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import indigo from '@material-ui/core/colors/indigo';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const background = '#202020';
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: indigo,
    background: {
      default: background,
    },
  },
});

const shapes = [
  {
    geometry: new three.TetrahedronGeometry(2),
    material: new three.MeshPhongMaterial({ color: 0x891515, emissive: 0x340606, side: three.DoubleSide, flatShading: true })
  },
  {
    geometry: new three.OctahedronGeometry(2),
    material: new three.MeshPhongMaterial({ color: 0x858915, emissive: 0x313406, side: three.DoubleSide, flatShading: true })
  },
  {
    geometry: new three.CubeGeometry(2, 2, 2),
    material: new three.MeshPhongMaterial({ color: 0x158935, emissive: 0x093406, side: three.DoubleSide, flatShading: true })
  },
  {
    geometry: new three.DodecahedronGeometry(2),
    material: new three.MeshPhongMaterial({ color: 0x156289, emissive: 0x060734, side: three.DoubleSide, flatShading: true })
  },
  {
    geometry: new three.IcosahedronGeometry(2),
    material: new three.MeshPhongMaterial({ color: 0x152489, emissive: 0x072534, side: three.DoubleSide, flatShading: true })
  }
]

class App extends Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)

    this.state = { width: 0, height: 0 };
    this.lastShape = -1;
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    const width = this.getWidth()
    const height = this.getWidth()

    const scene = new three.Scene()
    const camera = new three.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    const renderer = new three.WebGLRenderer({ antialias: true })

    this.scene = scene
    this.camera = camera
    this.renderer = renderer

    camera.position.z = 4.5
    let OrbitControls = Orbit(three);
    let orbit = new OrbitControls(camera);
    orbit.enableZoom = false;
    renderer.setClearColor(background)
    renderer.setSize(width, height)

    let lights = [];
    lights[0] = new three.PointLight(0xffffff, 1, 0);
    lights[1] = new three.PointLight(0xffffff, 1, 0);
    lights[2] = new three.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(- 100, - 200, - 100);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);

    this.randomShape();

    this.mount.appendChild(this.renderer.domElement)
    this.start()

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  updateWindowDimensions() {
    this.setState({ width: this.getWidth(), height: this.getHeight() });

    this.camera.aspect = this.getWidth() / this.getHeight();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.getWidth(), this.getHeight());
  }

  getWidth() {
    return window.innerWidth - 40;
  }

  getHeight() {
    return window.innerHeight - 100;
  }

  randomShape() {
    let index = -1;
    do {
      index = this.random(shapes.length);
    } while (index == this.lastShape);
    const shape = shapes[index];
    this.geometry = shape.geometry;
    this.material = shape.material;
    this.lastShape = index;
    const group = new three.Group();
    if (this.group !== undefined) {
      this.scene.remove(this.group);
      group.rotation.x = this.group.rotation.x;
      group.rotation.y = this.group.rotation.y;
    }
    group.add(new three.Mesh(this.geometry, this.material));
    this.scene.add(group);
    this.group = group;
  }

  onNewShpaeClick() {
    this.randomShape();
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    this.group.rotation.x += 0.005
    this.group.rotation.y += 0.005

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  random(max) {
    return Math.floor(Math.random() * (max));
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" color="inherit" className={classes.appTitle} noWrap>
                Random Platonic Solid
            </Typography>
              <Button color="inherit" onClick={() => this.onNewShpaeClick()}>New Solid</Button>
            </Toolbar>
          </AppBar>
          <Grid container>
            <Grid item style={{ padding: 20 }}>
              <div
                style={{ width: this.state.width - 10, height: this.state.height - 10 }}
                ref={(mount) => { this.mount = mount }}
              />
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </div>
    );
  }
}

const styles = {
  root: {
    flexGrow: 1,
  },
  appTitle: {
    marginLeft: -12,
    marginRight: 'auto',
    flexGrow: 1,
  },
};

export default withStyles(styles)(App);
