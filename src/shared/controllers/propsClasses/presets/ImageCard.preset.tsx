import { Expose } from '@Shared/controllers/meta/decorators';
import { Player } from '../Player';

const imageUrl = 'https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXhhbXBsZXxlbnwwfHwwfHx8MA%3D%3D';

export class ImageCard extends Player {
  name: string = 'ImageCard';
  width: number = 100;
  height: number = 100;
  x: number = 0;
  y: number = 0;
  position: boolean = false;

  @Expose()
  imageURL: string = imageUrl;

  @Expose({
    params: [{ name: 'ImageURL', type: 'string' }],
  })
  convertImageToBase64(ImageURL: string = imageUrl) {
    console.log(ImageURL);
  }

  @Expose({
    render: instance => (
      <div >
        <strong>Image Preview:</strong>
        <img
          src={imageUrl}
          alt="Preview"
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
        />
        <button onClick={() => instance.convertImageToBase64(imageUrl)}>
          Convert Image to Base64
        </button>
      </div>
    ),
  })
  ImagePreview: null = null;
}
