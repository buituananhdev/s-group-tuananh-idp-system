import { PassportStrategy } from "@nestjs/passport";
import { DoneFunction, Profile, Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { AuthenticationService } from "../authentication.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthenticationService
        ) {
        super({
            clientID: configService.get("GOOGLE_CLIENT_ID"),
            clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.get("GOOGLE_CALLBACK_URL"),
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(profile);
        console.log(accessToken);
        console.log(refreshToken);

        const user = await this.authService.validateGoogleUser(profile.emails[0].value, profile.displayName);
        
    }
}
