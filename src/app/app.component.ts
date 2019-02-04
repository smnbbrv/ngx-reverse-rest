import { Component, OnInit } from '@angular/core';
import { ReverseRestEntity } from '../../projects/ngx-reverse-rest/src/public_api';
import { BackendService } from './backend.service';

@ReverseRestEntity({
  urls: [
    '/api/rest/v1/entities',
    '/api/rest/v1/entities/:id',
    '/api/rest/v1/entity-groups/:groupId/entities',
    '/api/rest/v1/entity-groups/:groupId/entities/:id'
  ],
})
class ExampleEntity {
  id: string;
  name: string;

  constructor(options: Partial<ExampleEntity> = {}) {
    this.id = options.id;
    this.name = options.name;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private backend: BackendService) {
  }

  ngOnInit() {
    // get by auxiliary path parameter
    this.backend.getArray(ExampleEntity, { path: { groupId: 'example-group' } }).subscribe(entities => {
      console.log(entities.map(entity => entity.name));
    });

    // create
    this.backend.post(new ExampleEntity()).subscribe(entity => {
      console.log(entity.name);

      entity.name = 'new name';

      // update
      this.backend.put(entity).subscribe(updatedEntity => {
        console.log(updatedEntity.name);

        // delete
        this.backend.delete({ path: { id: updatedEntity } });
      });
    });
  }

}
