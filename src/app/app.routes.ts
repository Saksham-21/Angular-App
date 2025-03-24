import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChatAssistantComponent } from './pages/chat-assistant/chat-assistant.component';
import { CommunityComponent } from './pages/community/community.component';
import { GoalsComponent } from './pages/goals/goals.component';
import { ProgramComponent } from './pages/program/program.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'register',
        pathMatch:'full'
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'',
        component:LayoutComponent,
        children:[
            {
                path:'home',
                component:HomeComponent
            },
            {
                path:'dashboard',
                component:DashboardComponent
            },
            {
                path:'chatassistant',
                component:ChatAssistantComponent
            },
            {
                path:'community',
                component:CommunityComponent
            },
            {
                path:'goals',
                component:GoalsComponent
            },
            {
                path:'program',
                component:ProgramComponent
            }
        ]
    }
];
