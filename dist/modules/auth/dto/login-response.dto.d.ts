declare class UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    roles: string[];
    permissions: string[];
}
declare class TokensDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export declare class LoginResponseDto {
    user: UserDto;
    tokens: TokensDto;
}
export {};
