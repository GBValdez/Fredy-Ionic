import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { LeverComponent } from './Components/lever/lever.component';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  AnimationMixer,
  SkeletonHelper,
  Bone,
  AmbientLight,
  DirectionalLight,
  TextureLoader,
  Euler,
} from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, LeverComponent],
})
export class HomePage {
  @ViewChild('rendererCanvas', { static: true }) rendererCanvas!: ElementRef;

  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private fbxLoader!: FBXLoader;
  private clock!: Clock;
  private mixer!: AnimationMixer;
  private skeleton!: SkeletonHelper;
  private bones: Bone[] = [];

  ngOnInit() {
    //Import three fbxLoader
    this.initThreeJS();
    this.loadModel();
    this.onResize(); // Ajustar tamaño inicial
  }

  private initThreeJS() {
    // Crear la escena
    this.scene = new Scene();

    // Crear la cámara
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1, 3);

    // Crear el renderizador y establecer el canvas
    this.renderer = new WebGLRenderer({
      canvas: this.rendererCanvas.nativeElement,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Añadir luz
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);

    // Inicializar FBXLoader y Clock
    this.fbxLoader = new FBXLoader();
    this.clock = new Clock();
  }

  private loadModel() {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load('assets/Freddy Fazbear Texture.png');
    const emissionMap = textureLoader.load(
      'assets/Freddy Fazbear Emission.png'
    );
    let yap: boolean = false;
    this.fbxLoader.load('assets/Retro Freddy Fazbear.fbx', (object) => {
      console.log('Model:', object);
      object.traverse((child: any) => {
        if (child.isMesh) {
          child.material.map = texture;
          child.material.emissiveMap = emissionMap;
          child.material.emissiveIntensity = 1;
        }
        if (child.isSkinnedMesh && !yap) {
          yap = true;
          this.skeleton = new SkeletonHelper(child);
          this.bones = child.skeleton.bones;
          console.log('Bones:', this.bones);
          // console.log('Skeleton:', child);
          this.skeleton.visible = false; // Para ver el esqueleto, cambiar a true
          this.scene.add(this.skeleton);
        }
      });
      object.scale.set(0.005, 0.005, 0.005);
      object.position.set(0, -8, 0);

      this.mixer = new AnimationMixer(object);
      this.scene.add(object);
      this.animate();
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    if (this.mixer) {
      this.mixer.update(delta);
    }
    this.renderer.render(this.scene, this.camera);

    this.rotateHead();
    this.rotateEye();
    this.rotateJaw();
    this.rotateEyeBrow();
  }

  public rotateBone(boneName: string, rotation: Euler) {
    const bone = this.bones.find((b) => b.name === boneName);
    if (bone) {
      const rotAnterior = bone.rotation.clone();
      bone.rotation.x += rotation.x;
      bone.rotation.y += rotation.y;
      bone.rotation.z += rotation.z;
      // if (rotAnterior.equals(bone.rotation)) return;
      // console.log('Bone: ' + bone.name, bone.rotation);
    }
  }
  getBone(boneName: string): Bone | undefined {
    return this.bones.find((b) => b.name === boneName);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  rotHead: number = 0;
  rotEye: number = 0;
  rotJaw: number = 0;
  rotEyeBrow: number = 0;
  velocity: number = 0.008;
  rotateHead() {
    const rotation = new Euler(0, this.rotHead * this.velocity, 0);
    const bone = this.getBone('Head')!;
    this.rotateBone('Head', rotation);
    bone.rotation.y = this.clamb(bone.rotation.y, -0.8, 0.8);
  }
  rotateEye() {
    const rotationR = new Euler(-this.rotEye * this.velocity, 0, 0);
    const rotationL = new Euler(this.rotEye * this.velocity, 0, 0);
    const boneEyeR = this.getBone('PupilR')!;
    const boneEyeL = this.getBone('PupilL')!;
    this.rotateBone('PupilR', rotationR);
    this.rotateBone('PupilL', rotationL);
    boneEyeR.rotation.x = this.clamb(boneEyeR.rotation.x, -0.55, 0.55);
    boneEyeL.rotation.x = this.clamb(boneEyeL.rotation.x, -0.55, 0.55);
  }
  rotateJaw() {
    const rotation = new Euler(this.rotJaw * this.velocity, 0, 0);
    const bone = this.getBone('Jaw')!;
    this.rotateBone('Jaw', rotation);
    bone.rotation.x = this.clamb(bone.rotation.x, 1.57, 2.03);
  }
  rotateEyeBrow() {
    const rotationR = new Euler(0, this.rotEyeBrow * this.velocity, 0);
    const rotationL = new Euler(0, -this.rotEyeBrow * this.velocity, 0);
    const boneR = this.getBone('EyebrowR')!;
    const boneL = this.getBone('EyebrowL')!;
    this.rotateBone('EyebrowR', rotationR);
    this.rotateBone('EyebrowL', rotationL);
    //- 0.79   -0.03
    boneR.rotation.y = this.clamb(boneR.rotation.y, -0.16, 0.81);
    boneL.rotation.y = this.clamb(boneL.rotation.y, -0.81, 0.16);
  }

  clamb(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
}
