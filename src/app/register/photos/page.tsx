import RegisterPhotos from '../photos';
import { Suspense } from 'react';

export default function RegisterPhotosPage() {
	return (
		<Suspense>
			<RegisterPhotos />
		</Suspense>
	);
}
