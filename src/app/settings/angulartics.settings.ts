import { Angulartics2Settings } from 'angulartics2';
import { environment } from '../../environments/environment';

export const angularticsSettings: Partial<Angulartics2Settings> = {
  developerMode: !environment.production
};
