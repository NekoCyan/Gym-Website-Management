import { JWTPayload } from 'jose';

export interface TokenPayload extends JWTPayload {
	username: string;
	email: string;
}
