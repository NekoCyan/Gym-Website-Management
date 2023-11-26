import { JWTPayload } from 'jose';

export interface TokenPayload extends JWTPayload {
	userId: number;
}
