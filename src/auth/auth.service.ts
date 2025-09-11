import { BadRequestException, Injectable } from "@nestjs/common";
import { FirebaseAdminService } from "src/firebase/firebase-admin.service";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private firebaseService: FirebaseAdminService) { }
    async verifyIdToken(idToken: string) {
        try {
            if (!idToken) {
                throw new BadRequestException('Missing idToken');
            }
            const decodedToken = await this.firebaseService.verifyIdToken(idToken);
            if (!decodedToken) {
                throw new BadRequestException('Invalid idToken');
            }
            const user = await this.prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
            if (user) {
                console.log('User already exists');
                return user;
            }
            const newUser = await this.prisma.user.create({
                data: {
                    firebaseUid: decodedToken.uid || '',
                    email: decodedToken.email || '',
                    name: decodedToken.name || '',
                    picture: decodedToken.picture || '',
                },
            });
            return newUser;
        } catch (error) {
            console.log("Service : AuthService /n Method : verifyIdToken /n Error : ", error);
            throw error;
        }
    }
}