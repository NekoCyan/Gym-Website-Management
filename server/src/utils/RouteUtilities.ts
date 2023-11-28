import { UserHydratedDocument } from '@/app/models/interfaces';
import { ResponseText, ROLES } from '.';

export function TrainerRequired(self: UserHydratedDocument) {
	if (self.role < ROLES.TRAINER) throw new Error(ResponseText.NoPermission);
}

export function AdminRequired(self: UserHydratedDocument) {
	if (self.role < ROLES.ADMIN) throw new Error(ResponseText.NoPermission);
}
