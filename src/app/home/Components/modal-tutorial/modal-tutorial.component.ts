import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-modal-tutorial',
  templateUrl: './modal-tutorial.component.html',
  styleUrls: ['./modal-tutorial.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class ModalTutorialComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}
  closeModal() {
    this.modalCtrl.dismiss();
    // Close the modal
  }
}
